export const HowItWorks = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary-100 text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
          1
        </div>
        <div>
          <h3 className="text-primary-700 text-lg font-medium">İlan Oluştur</h3>
          <p className="text-secondary-700 mt-1">
            İhtiyacınızı veya yardım teklifinizi belirtin, kategori seçin ve
            konum ekleyin.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-primary-100 text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
          2
        </div>
        <div>
          <h3 className="text-primary-700 text-lg font-medium">Eşleştirme</h3>
          <p className="text-secondary-700 mt-1">
            Sistem, ilan ve konumlara göre otomatik eşleştirmeler sunar.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-primary-100 text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
          3
        </div>
        <div>
          <h3 className="text-primary-700 text-lg font-medium">İletişim</h3>
          <p className="text-secondary-700 mt-1">
            Eşleşme sonrası platformumuz üzerinden güvenli iletişim
            kurabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
