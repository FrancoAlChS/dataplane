"use client";

import { Button } from "@/shared/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/presentation/components/ui/card";
import { Checkbox } from "@/shared/presentation/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/presentation/components/ui/form";
import { Input } from "@/shared/presentation/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/presentation/components/ui/select";
import { MySQL } from "@/shared/presentation/icons/mysql";
import { PostgreSQL } from "@/shared/presentation/icons/PostgreSQL";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database as DatabaseIcon, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Database } from "../../domain/database";
import {
  saveCredentials,
  testConnection,
} from "../../infrastructure/sa/database.sa";
import { setupValidation } from "../validations/setup.validation";

type SetupFormValues = z.infer<typeof setupValidation>;

export function SetupForm() {
  const router = useRouter();
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(setupValidation),
    defaultValues: {
      host: "",
      port: 5432,
      user: "",
      password: "",
      database: "",
      ssl: false,
      type: "postgres",
    },
  });

  const handleTest = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error(
        "Por favor, complete los campos correctamente antes de probar la conexión.",
      );
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testConnection(values as Database);
      setTestResult(result);
      if (result.success) {
        toast.success("Conexión exitosa!");
      } else {
        toast.error(`Conexión fallida`, {
          description: result.error,
        });
      }
    } catch {
      toast.error("Error al probar la conexión");
    } finally {
      setIsTesting(false);
    }
  };

  const onSave = async (values: SetupFormValues) => {
    if (!testResult?.success) {
      toast.warning(
        "Por favor, prueba la conexión exitosamente antes de guardar.",
      );
      return;
    }

    setIsSaving(true);
    try {
      await saveCredentials(values as Database);
      toast.success("Credenciales guardadas correctamente!");
      router.push("/tables");
      router.refresh();
    } catch {
      toast.error("Error guardando credenciales");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-2">
            <DatabaseIcon className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">Database Setup</CardTitle>
          </div>
          <CardDescription>
            Ingrese sus credenciales de base de datos para comenzar a usar
            dataplane.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select database type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="postgres">
                          <PostgreSQL className="size-4" /> PostgreSQL
                        </SelectItem>
                        <SelectItem value="mysql" disabled>
                          <MySQL className="size-4 text-black" /> MySQL (Coming
                          Soon)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host</FormLabel>
                        <FormControl>
                          <Input placeholder="localhost" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puerto</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={`${field.value}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="database"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de base datos</FormLabel>
                    <FormControl>
                      <Input placeholder="my_database" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="postgres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ssl"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Habilitar SSL</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="w-full mt-5 flex gap-3">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTest}
                  disabled={isTesting || isSaving}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={!testResult?.success || isSaving || isTesting}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save & Access
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
