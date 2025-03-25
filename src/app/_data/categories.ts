import type { Category } from "../_components/category-card";

export const categories: Category[] = [
  {
    name: "Temel İhtiyaçlar",
    description: "Su, yiyecek, battaniye, hijyen malzemesi",
    count: 24,
  },
  {
    name: "Ulaşım",
    description: "Araçla nakliye, güvenli geçiş noktaları, bisiklet paylaşımı",
    count: 18,
  },
  {
    name: "Sağlık",
    description: "İlk yardım, tıbbi malzeme, psikolojik destek",
    count: 15,
  },
  {
    name: "Teknik Destek",
    description:
      "Fotoğraf/video çekimi, drone pilotluğu, sosyal medya yönetimi",
    count: 9,
  },
  {
    name: "Hukuki Destek",
    description: "Hukuki danışmanlık, bilgilendirme ve yönlendirme",
    count: 6,
  },
  {
    name: "Diğer",
    description: "Çeviri, barınma ve diğer destek türleri",
    count: 12,
  },
];
