import { useEffect, useState } from "react";

export const useTranslations = (language) => {
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    import(`@/Languages/${language}.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error("Error importing translations:", error);
      });
  }, [language]);

  return translations;
};
