import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginFormProps = {
    email: string
    password: string
    onChangeEmail: (v: string) => void
    onChangePassword: (v: string) => void
    onSubmit: () => void
}

export function LoginForm({
                              email,
                              password,
                              onChangeEmail,
                              onChangePassword,
                              onSubmit,
                          }: LoginFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmit()
                    }}
                    className="flex flex-col gap-6"
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => onChangeEmail(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => onChangePassword(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
