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
  const { isOpen } = useSidebar()

  return (
    <aside
      ref={ref}
      className={cn(
        "z-40 h-screen transition-all duration-300 bg-white border-r border-slate-200 sticky top-0",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, toggle } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-4 border-b border-slate-200", className)}
      {...props}
    >
      {isOpen && <div className="font-semibold text-indigo-600">{children}</div>}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="ml-auto"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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

