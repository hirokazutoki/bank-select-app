import * as React from "react"
import { useRouter } from "next/navigation";
import {
    Menu,
    Languages,
    LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function HamburgerMenu() {
    const router = useRouter();
    const [language, setLanguage] = React.useState("ja")
    const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

    const handleLogout = () => {
        // ここにログアウト処理を書く
        console.log("logout!");
        router.push("/login");
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-lg" aria-label="More Options">
                        <Menu />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Languages />
                                言語
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={language}
                                    onValueChange={setLanguage}
                                >
                                    <DropdownMenuRadioItem value="en">
                                        English
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="ja">
                                        日本語
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setOpenLogoutDialog(true)}
                        >
                            <LogOut />
                            ログアウト
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* AlertDialog */}
            <AlertDialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                            現在のセッションが終了し、ログイン画面に移動します。
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className='font-bold'>
                            ログアウト
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
