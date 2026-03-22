export default function SettingItem({ icon: Icon, title, description, children }) {
  return (
    <div className="p-4 bg-lightElements dark:bg-darkElements text-light dark:text-dark border-2 border-light dark:border-dark rounded-xl hover:shadow-md transition-shadow">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-3 flex-1">
          {Icon && (
            <div>
              <Icon className="w-5 h-5 " />
            </div>
          )}
          <div>
            <h3 className="font-semibold">
              {title}
            </h3>
            {/*10 March 2026: commenting it because i just ruin the style and i need to think of how i can get more space, making the title without the desc is simpler, the user dosen't need any description */}
            {/* {description && (
              <p className="text-sm">
                {description}
              </p>
            )} */}
          </div>
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}