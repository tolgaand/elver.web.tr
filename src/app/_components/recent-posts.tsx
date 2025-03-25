export const RecentPosts = () => {
  return (
    <div className="space-y-4">
      <div className="border-accent-300 border-b pb-3">
        <h3 className="text-primary-700 font-medium">İçme suyu ihtiyacı</h3>
        <p className="text-secondary-600 text-sm">Kadıköy, 2 saat önce</p>
      </div>

      <div className="border-accent-300 border-b pb-3">
        <h3 className="text-primary-700 font-medium">Nakliye yardımı</h3>
        <p className="text-secondary-600 text-sm">Beşiktaş, 4 saat önce</p>
      </div>

      <div className="pb-3">
        <h3 className="text-primary-700 font-medium">İlk yardım malzemeleri</h3>
        <p className="text-secondary-600 text-sm">Şişli, 5 saat önce</p>
      </div>
    </div>
  );
};

export default RecentPosts;
