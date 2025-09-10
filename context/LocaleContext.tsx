import { Locale, detectInitialLocale, setLocale as i18nSetLocale } from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';


interface Val { locale: Locale; setLocale: (l: Locale) => Promise<void>; }
const Ctx = createContext<Val | undefined>(undefined);


export const LocaleProvider: React.FC<{ children: React.ReactNode; defaultLocale?: Locale }> = ({ children, defaultLocale = 'zh-Hant' }) => {
const [locale, setLoc] = useState<Locale>(defaultLocale);


useEffect(() => {
(async () => {
const saved = (await AsyncStorage.getItem('locale')) as Locale | null;
const initial = saved || detectInitialLocale(defaultLocale);
i18nSetLocale(initial);
setLoc(initial);
})();
}, [defaultLocale]);


const setLocale = async (l: Locale) => {
i18nSetLocale(l); setLoc(l); await AsyncStorage.setItem('locale', l);
};


const value = useMemo(() => ({ locale, setLocale }), [locale]);
return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};


export const useLocale = () => {
const v = useContext(Ctx);
if (!v) throw new Error('useLocale must be used within LocaleProvider');
return v;
};