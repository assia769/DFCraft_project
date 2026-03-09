import { Filter } from "lucide-react";
import { useTranslation } from "../../shared/i18n/translations";

export default function 
FilterBar({ 
  filterType, 
  setFilterType, 
  filterPriority, 
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  taskTypes,
  priorities 
}) {

  const { t } = useTranslation("ToDoTasks");

  return (
    <div className="bg-lightList dark:bg-darkList rounded-xl p-4 mb-4 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-lightElements dark:text-darkElements" />
        <h3 className="font-semibold text-lightElements dark:text-darkElements">
          {t("filter")}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Type Filter */}
        <div>
          <label className="block text-xs font-medium text-lightPlaceHolder dark:text-darkPlaceHolder mb-1">
            {t("type")}
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t("allType")}</option>
            {taskTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs font-medium text-lightPlaceHolder dark:text-darkPlaceHolder mb-1">
            {t("priority")}
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t("allProperity")}</option>
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.label}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-lightPlaceHolder dark:text-darkPlaceHolder mb-1">
            {t("status")}
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t("all")}</option>
            <option value="active">{t("actives")}</option>
            <option value="completed">{t("ended")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}