
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'lojista');
CREATE TYPE public.lojista_status AS ENUM ('aguardando_aprovacao', 'ativo', 'inativo', 'rejeitado');
CREATE TYPE public.metrica_tipo AS ENUM ('visualizacao', 'clique_whatsapp', 'acesso_mapa', 'clique_site');

-- ============ HELPER: updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios veem seu proprio perfil" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Usuarios atualizam seu proprio perfil" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Usuarios criam seu proprio perfil" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto cria profile no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- Por padrão, novo usuário é lojista
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'lojista');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Usuarios veem seus proprios roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins gerenciam roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ CATEGORIAS ============
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icone TEXT,
  cor TEXT,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categorias TO anon, authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos veem categorias" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Admins gerenciam categorias" ON public.categorias FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LOJISTAS ============
CREATE TABLE public.lojistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  nome_fantasia TEXT NOT NULL,
  razao_social TEXT,
  cnpj TEXT,
  descricao TEXT,
  slogan TEXT,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  -- contato
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  site TEXT,
  -- endereço
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- redes sociais
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  -- mídia
  logo_url TEXT,
  capa_url TEXT,
  galeria JSONB DEFAULT '[]'::jsonb,
  -- status
  status lojista_status NOT NULL DEFAULT 'aguardando_aprovacao',
  destaque BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lojistas_status ON public.lojistas(status);
CREATE INDEX idx_lojistas_categoria ON public.lojistas(categoria_id);
CREATE INDEX idx_lojistas_user ON public.lojistas(user_id);
CREATE INDEX idx_lojistas_destaque ON public.lojistas(destaque) WHERE destaque = true;

GRANT SELECT ON public.lojistas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lojistas TO authenticated;
GRANT ALL ON public.lojistas TO service_role;
ALTER TABLE public.lojistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publico ve lojistas ativos" ON public.lojistas
  FOR SELECT USING (status = 'ativo');
CREATE POLICY "Lojista ve sua loja" ON public.lojistas
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin ve tudo" ON public.lojistas
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lojista cria sua loja" ON public.lojistas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lojista atualiza sua loja" ON public.lojistas
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin atualiza qualquer loja" ON public.lojistas
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin remove loja" ON public.lojistas
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lojistas_updated_at BEFORE UPDATE ON public.lojistas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PRODUTOS ============
CREATE TABLE public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lojista_id UUID NOT NULL REFERENCES public.lojistas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2),
  foto_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_produtos_lojista ON public.produtos(lojista_id);
CREATE INDEX idx_produtos_ativo ON public.produtos(ativo);

GRANT SELECT ON public.produtos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publico ve produtos ativos de lojas ativas" ON public.produtos
  FOR SELECT USING (
    ativo = true AND EXISTS (
      SELECT 1 FROM public.lojistas l
      WHERE l.id = lojista_id AND l.status = 'ativo'
    )
  );
CREATE POLICY "Lojista ve seus produtos" ON public.produtos
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  );
CREATE POLICY "Admin ve todos produtos" ON public.produtos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lojista gerencia seus produtos" ON public.produtos
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  );
CREATE POLICY "Admin gerencia todos produtos" ON public.produtos
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ METRICAS ============
CREATE TABLE public.metricas_lojista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lojista_id UUID NOT NULL REFERENCES public.lojistas(id) ON DELETE CASCADE,
  tipo metrica_tipo NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_metricas_lojista ON public.metricas_lojista(lojista_id);
CREATE INDEX idx_metricas_tipo ON public.metricas_lojista(tipo);
CREATE INDEX idx_metricas_created ON public.metricas_lojista(created_at);

GRANT INSERT ON public.metricas_lojista TO anon, authenticated;
GRANT SELECT ON public.metricas_lojista TO authenticated;
GRANT ALL ON public.metricas_lojista TO service_role;
ALTER TABLE public.metricas_lojista ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um registra metrica" ON public.metricas_lojista
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Lojista ve suas metricas" ON public.metricas_lojista
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  );
CREATE POLICY "Admin ve todas metricas" ON public.metricas_lojista
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ SEED CATEGORIAS ============
INSERT INTO public.categorias (nome, slug, icone, cor, ordem) VALUES
  ('Moda', 'moda', 'Shirt', '#F5A623', 1),
  ('Alimentação', 'alimentacao', 'UtensilsCrossed', '#E74C3C', 2),
  ('Serviços', 'servicos', 'Wrench', '#3498DB', 3),
  ('Beleza & Saúde', 'beleza-saude', 'Sparkles', '#E91E63', 4),
  ('Casa & Decoração', 'casa-decoracao', 'Home', '#9B59B6', 5),
  ('Esportes', 'esportes', 'Dumbbell', '#27AE60', 6),
  ('Tecnologia', 'tecnologia', 'Laptop', '#1A2E5A', 7),
  ('Automotivo', 'automotivo', 'Car', '#34495E', 8);
