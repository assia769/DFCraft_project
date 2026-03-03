export default function SettingItem({ icon: Icon, title, description, children }) {
  return (
    <div className="p-4 bg-light dark:bg-dark rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className="mt-1">
              <Icon className="w-5 h-5 text-lightElements dark:text-darkElements" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lightElements dark:text-darkElements mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-lightPlaceHolder dark:text-darkPlaceHolder">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}