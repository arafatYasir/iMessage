import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 rounded-full border border-default bg-surface p-1 shadow-sm">
            <Button
                size="sm"
                variant={theme === "light" ? "primary" : "ghost"}
                isIconOnly
                onPress={() => setTheme("light")}
                className="transition-all duration-250 ease-in-out"
            >
                <Sun className="size-4" />
            </Button>
            <Button
                size="sm"
                variant={theme === "dark" ? "primary" : "ghost"}
                isIconOnly
                onPress={() => setTheme("dark")}
                className="transition-all duration-250 ease-in-out"
            >
                <Moon className="size-4" />
            </Button>
        </div>
    );
}

export default ThemeToggle;