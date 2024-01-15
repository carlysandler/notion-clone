"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggle } from "@/lib/features/dialog/settingsDialogSlice"
import { ModeToggle } from "@/components/mode-toggle"
import { Label } from "@/components/ui/label"

export const SettingsModal = () => {
	const dispatch = useAppDispatch()
	const isOpen = useAppSelector((state) => state.settings.isOpen)

	return (
		<Dialog open={isOpen} onOpenChange={() => dispatch(toggle(false))}>
			<DialogContent>
				<DialogHeader className="border-b pb-3">
					<h2 className="text-lg font-medium text-[#3F3F3F] dark:text-[#CFCFCF] ">
						My Settings
					</h2>
				</DialogHeader>
				<div className="flex items-center justify-between">
					<div className="flex flex-col space-y-1">
						<Label className="text-[#3F3F3F] dark:text-[#CFCFCF]">
							Appearance
						</Label>
						<span className="text-[0.8rem] text-muted-foreground">
							Customize how Scribble looks on your device
						</span>
					</div>
					<ModeToggle />
				</div>
			</DialogContent>
		</Dialog>
	)
}