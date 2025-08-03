import { Loader } from '@components/Loader';
import { selectSettings } from '@store/selectors/setttings.selector';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const SettingsLoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const settings = useSelector(selectSettings);

  const isSettingsLoaded = useMemo((): boolean => {
    return Object.values(settings.loaded).every((loaded) => loaded);
  }, [settings.loaded]);

  const settingsErrors = useMemo(
    (): string[] => [
      ...new Set(Object.values(settings.errors).filter((err) => err !== null)),
    ],
    [settings.errors]
  );

  return (
    <>
      {!isSettingsLoaded ? (
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-40"
        >
          <div className="flex-col justify-center items-center">
            <div className="flex items-center justify-center z-50">
              <Loader />
            </div>
            {settingsErrors.length > 0 && (
              <div className="p-2 mt-3 text-red-400">
                {settingsErrors.join(', ')}
              </div>
            )}
          </div>
        </motion.section>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
