import { SettingsProvider } from './shared/context/SettingsContext';

import MainLayout from './components/Layout/MainLayout/MainLayout'

function App() {
  return (
  <SettingsProvider>  
    <MainLayout />
  </SettingsProvider> 
  )
}

export default App