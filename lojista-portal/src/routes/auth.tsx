import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, Loader2, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso | Sindilojas" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo!");
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Faça login para continuar.");
    setTab("signin");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setLoading(false);
      toast.error("Falha no login com Google: " + error.message);
      return;
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-secondary-foreground/80 hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao portal
          </Link>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl gradient-gold shadow-gold">
                <Store className="h-6 w-6 text-secondary" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold">Portal do Lojista</h1>
                <p className="text-xs text-muted-foreground">Acesse sua conta ou cadastre sua loja</p>
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="mt-5 space-y-4">
                  <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field icon={Lock} label="Senha" type="password" value={password} onChange={setPassword} required />
                  <Button type="submit" disabled={loading} className="w-full gradient-gold text-secondary shadow-gold hover:opacity-90">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Label>Seu nome</Label>
                    <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
                  </div>
                  <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field icon={Lock} label="Senha" type="password" value={password} onChange={setPassword} required minLength={6} />
                  <Button type="submit" disabled={loading} className="w-full gradient-gold text-secondary shadow-gold hover:opacity-90">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
            </div>

            <Button type="button" variant="outline" onClick={handleGoogle} disabled={loading} className="w-full">
              <GoogleIcon /> Continuar com Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type, value, onChange, ...rest }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type={type} value={value} onChange={(e: any) => onChange(e.target.value)} className="pl-9" {...rest} />
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 11v3.4h5.6c-.3 1.5-1.6 4.3-5.6 4.3-3.4 0-6.2-2.8-6.2-6.2s2.8-6.2 6.2-6.2c2 0 3.2.8 4 1.5l2.7-2.6C16.8 3.5 14.7 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6 0 9.7-4.2 9.7-10.1 0-.7-.1-1.2-.2-1.7H12z" />
    </svg>
  );
}
