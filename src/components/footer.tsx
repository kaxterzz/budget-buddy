/** 
 * Footer component
 * Shows details about project
*/

import { Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="flex flex-row items-center justify-center space-x-2 my-4">
            <p>Made with </p>
            <Heart className="h-4 w-4 mx-2 mb-0 text-red-500" />
            <p><a href="https://kasuns.me" target="_blank" className="hover:text-teal-600 hover:animate-pulse">by Thilanka Kasun</a> - 2025</p>
        </footer>
    )
}