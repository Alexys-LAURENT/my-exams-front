'use client'
import { HeroUIProvider } from "@heroui/system";

export function UiProviders({ children }: { children: React.ReactNode }) {
	return <HeroUIProvider className="w-full flex flex-col items-center flex-1 ">{children}</HeroUIProvider>;
}
