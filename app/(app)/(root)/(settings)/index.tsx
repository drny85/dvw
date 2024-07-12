import React from 'react'

import ModernSettingsPage from '@/common/components/ModernSettingsPage'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'

const Settings = () => {
    useStatusBarColor('dark')

    return <ModernSettingsPage />
}

export default Settings
