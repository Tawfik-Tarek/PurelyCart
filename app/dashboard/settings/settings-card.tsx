"use client";
import { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { useRef, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/utils/uploadthing";

export default function SettingsCard({ session }: { session: Session }) {

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);
  const uploadBtnRef = useRef();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.user?.name || undefined,
      email: session.user?.email || undefined,
      image: session.user?.image || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data.data?.error) {
        setSuccess("");
        setError(data.data?.error.message);
      } else if (data.data?.success) {
        setError("");
        setSuccess(data.data?.success.message);
      }
    },

    onError: (err) => {
      setSuccess("");
      setError("Something went wrong!");
    },
  });

  const onSubmit = (data: z.infer<typeof SettingsSchema>) => {
    execute(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jhon Doe"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") ? (
                      <div className="font-extrabold bg-primary text-secondary rounded-full h-12 w-12 flex justify-center items-center">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <Image
                        width={48}
                        height={48}
                        src={form.getValues("image")!}
                        alt="Avatar"
                        className="rounded-full h-12 w-12"
                      />
                    )}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar</div>;
                          return <div>Uploading...</div>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      className="hidden"
                      placeholder="Avatar"
                      disabled={status === "executing"}
                      {...field}
                    />
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
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={status === "executing" || session.user.isOuth}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={status === "executing" || session.user.isOuth}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormControl>
                    <Switch
                      className="scale-90 important-margin-top-0"
                      disabled={status === "executing" || session.user.isOuth}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button
              disabled={status === "executing" || avatarUploading}
              type="submit"
            >
              Update Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
