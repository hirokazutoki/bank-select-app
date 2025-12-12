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

export function HamburgerMenu() {
    const router = useRouter();
    const [language, setLanguage] = React.useState("ja")

    const handleLogout = () => {
        // ここにログアウト処理を書く
        console.log("logout!");
        router.push("/login");
    };

    return (
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
                    <DropdownMenuItem variant="destructive"　onClick={handleLogout}>
                        <LogOut />
                        ログアウト
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
