import * as React from "react"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { toggleSidebar } from "@/store/uiSlice"
import { Menu, X } from "lucide-react"
import { Button } from "./button"

const SidebarContext = React.createContext({
  isOpen: true,
  toggle: () => {},
})

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

export const SidebarProvider = ({ children }) => {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.ui.sidebarOpen)

  const toggle = () => {
    dispatch(toggleSidebar())
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, toggle } = useSidebar()
  const dispatch = useDispatch() // Need display for closing on mobile



  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggle}
      />

      <aside
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-slate-200 shadow-xl md:shadow-none overflow-x-hidden",
          "md:sticky md:top-0 md:translate-x-0", // Desktop: sticky, always visible (transform handled by width prop in logic below?)
          // Actually, for desktop we want to animate width, for mobile we animate translate
          // Let's separate mobile and desktop logic more clearly via classes
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", 
          // Desktop width handling:
          isOpen ? "md:w-64" : "md:w-16",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, toggle } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-4 border-b border-slate-200 h-16", className)}
      {...props}
    >
      {(isOpen || window.innerWidth >= 768) && (
             <div className="font-bold text-xl text-indigo-600 tracking-tight flex items-center gap-2">

                <span className={cn("transition-opacity duration-200", isOpen ? "opacity-100" : "md:opacity-0 md:hidden")}>
                    {children}
                </span>
             </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="ml-auto md:flex hidden" // Only show internal toggle on desktop to collapse? 
        // Actually, on mobile we need an external toggle.
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
       {/* Mobile Close Button */}
       <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="ml-auto md:hidden flex"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col p-4 space-y-2 overflow-y-auto", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarContent.displayName = "SidebarContent"

const SidebarItem = React.forwardRef(({ className, children, icon, active, ...props }, ref) => {
  const { isOpen } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
        active
          ? "bg-indigo-50 text-indigo-700 font-medium"
          : "text-slate-700 hover:bg-slate-100",
        !isOpen && "justify-center",
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {isOpen && <span className="flex-1">{children}</span>}
    </div>
  )
})
SidebarItem.displayName = "SidebarItem"

const SidebarFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t border-slate-200", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarFooter.displayName = "SidebarFooter"

export { Sidebar, SidebarHeader, SidebarContent, SidebarItem, SidebarFooter }

