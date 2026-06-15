import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Button } from '@heroui/react';
import { ThemeProvider } from "./context/ThemeContext";
import { WallpaperProvider } from "./context/WallpaperContext";

function App() {

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <div className='flex justify-center'>
          <Button>My Lovely Button</Button>
          <header>
            <Show when="signed-out">
              <SignInButton mode="modal" />
              <SignUpButton mode="modal" />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
        </div>
      </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App
