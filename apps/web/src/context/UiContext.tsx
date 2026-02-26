import { createContext, useContext, useState, ReactNode } from 'react';

interface UiContextType {
    isAiModalOpen: boolean;
    openAiModal: () => void;
    closeAiModal: () => void;
    toggleAiModal: () => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: ReactNode }) {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const openAiModal = () => setIsAiModalOpen(true);
    const closeAiModal = () => setIsAiModalOpen(false);
    const toggleAiModal = () => setIsAiModalOpen(prev => !prev);

    return (
        <UiContext.Provider value={{ isAiModalOpen, openAiModal, closeAiModal, toggleAiModal }}>
            {children}
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);
    if (context === undefined) {
        throw new Error('useUi must be used within a UiProvider');
    }
    return context;
}
