
-- Leitura pública dos arquivos no bucket lojistas
CREATE POLICY "Publico ve arquivos de lojistas" ON storage.objects
  FOR SELECT USING (bucket_id = 'lojistas');

-- Lojista autenticado faz upload na sua própria pasta {user_id}/...
CREATE POLICY "Lojista envia arquivos na sua pasta" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'lojistas'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Lojista atualiza seus arquivos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'lojistas'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Lojista remove seus arquivos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'lojistas'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admin gerencia qualquer arquivo lojistas" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'lojistas' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'lojistas' AND public.has_role(auth.uid(), 'admin'));
