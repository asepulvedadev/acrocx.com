import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signIn, testConnection } from "@/lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection();
      setConnectionStatus(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con la base de datos",
          variant: "destructive",
        });
      }
    };

    checkConnection();
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { session } = await signIn(email, password);
      
      if (session) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración",
        });
        navigate("/admin/dashboard");
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      console.error('Error de login:', error);
      toast({
        title: "Error de autenticación",
        description: error.message === "Invalid login credentials"
          ? "Credenciales inválidas"
          : "Error al iniciar sesión. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[var(--radius)] border bg-white p-8 shadow-lg"
      >
        {/* Logo y enlace a inicio */}
        <Link 
          to="/" 
          className="mb-8 flex flex-col items-center text-center transition-colors hover:text-primary"
        >
          <h1 className="text-4xl font-bold text-primary">Acrocx</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Home className="h-4 w-4" />
            Volver al inicio
          </div>
        </Link>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Panel de Administración</h2>
          <p className="mt-2 text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
          {connectionStatus === false && (
            <p className="mt-2 text-sm text-destructive">
              Error de conexión con la base de datos
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border bg-white pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="admin@acrocx.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border bg-white pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || connectionStatus === false}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          {connectionStatus === false && (
            <p className="text-center text-sm text-destructive">
              No se puede iniciar sesión debido a problemas de conexión
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
