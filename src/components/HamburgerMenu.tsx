"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, Languages, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
} from "@/components/ui/dropdown-menu";

export function HamburgerMenu() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/login");
    };

    const changeLang = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-lg">
                    <Menu />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Languages />
                            {t("languages")}
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                                value={lang}
                                onValueChange={changeLang}
                            >
                                <DropdownMenuRadioItem value="en">
                                    {t("english")}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="ja">
                                    {t("japanese")}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                        <LogOut />
                        {t("logout")}
                    </DropdownMenuItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
