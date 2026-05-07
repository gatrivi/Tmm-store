/**
 * @file menu.ts
 * @description Fuente única de la verdad (Single Source of Truth) para los datos del menú.
 * Contiene las interfaces que modelan los productos y la constante `menuData` con
 * la información estática (precios, descripciones, variaciones, imágenes) que nutre
 * a toda la aplicación.
 */
export type TabCategory = 'choripan' | 'meat' | 'veggie' | 'extras';

export interface MenuOption {
  id: string;
  label: string;
  labelEn?: string;
  labelPt?: string;
  labelRu?: string;
  labelDe?: string;
  price: number;
  available?: boolean;
  suffix?: string;
  suffixEn?: string;
  suffixPt?: string;
  suffixRu?: string;
  suffixDe?: string;
  features?: string[];
  featuresEn?: string[];
  featuresPt?: string[];
  featuresRu?: string[];
  featuresDe?: string[];
}

export interface MenuItemType {
  id: string;
  name: string;
  nameEn?: string;
  namePt?: string;
  nameRu?: string;
  nameDe?: string;
  category: TabCategory;
  description: string;
  descriptionEn?: string;
  descriptionPt?: string;
  descriptionRu?: string;
  descriptionDe?: string;
  images: string[];
  /** Map: image URL → CSS object-position value (e.g. 'center top') */
  imagePositions?: Record<string, string>;
  
  // Archivos gestionados (File Manager)
  customImages?: string[]; // Imágenes subidas por el usuario en Base64
  hiddenImages?: string[]; // Imágenes estáticas que el usuario eliminó/ocultó
  imageOrder?: string[];   // Orden explícito de las imágenes

  options: MenuOption[];
  available?: boolean;
  badge?: string;
}

export const menuData: MenuItemType[] = [
  {
    id: "choripan",
    name: "Choripán",
    nameEn: "Choripán",
    namePt: "Choripán",
    nameRu: "Чорипан",
    nameDe: "Choripán",
    category: "choripan",
    badge: "Más pedido",
    description: "El clásico de la casa: Chorizo mariposa bien doradito en pan francés, con nuestro chimichurri casero.",
    descriptionEn: "The house classic: Golden butterfly-cut pork sausage served on French bread, topped with our homemade chimichurri sauce.",
    descriptionPt: "O clássico da casa: Linguiça toscana dourada na chapa servida no pão francês com chimichurri caseiro.",
    descriptionRu: "Наш хит: поджаренная аргентинская колбаска во французском багете с домашним чимичурри.",
    descriptionDe: "Argentinische Bratwurst im französischen Baguette, knusprig gegrillt und verfeinert mit hausgemachtem Chimichurri.",
    images: [
      "/Fotos menu/choripan/1.jpg",
      "/Fotos menu/choripan/2.jpg",
      "/Fotos menu/choripan/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 14500, suffix: " La experiencia completa: + papas y bebida.", suffixEn: " The full experience: + fries and soda.", suffixPt: " A experiência completa: acompanha batata frita super crocante e refrigerante.", suffixRu: " Полный набор: + картофель фри и напиток.", suffixDe: " Das volle Erlebnis: + Pommes und Getränk.", features: ["Papas", "Bebida"], featuresEn: ["Fries", "Soda"], featuresPt: ["Batata Frita", "Refri"], featuresRu: ["Картофель фри", "Напиток"], featuresDe: ["Pommes", "Getränk"] },
      { id: "solo", label: "Solo", labelEn: "Solo", labelPt: "Só o lanche", labelRu: "Только сэндвич", labelDe: "Nur Sandwich", price: 7500, suffix: " Para ir directo al grano.", suffixEn: " Straight to the point.", suffixPt: " Simples e direto ao ponto.", suffixRu: " Ничего лишнего.", suffixDe: " Kurz und bündig." }
    ]
  },
  {
    id: "hamburguesa",
    name: "Hamburguesa",
    nameEn: "Burger",
    namePt: "Hambúrguer",
    nameRu: "Бургер",
    nameDe: "Burger",
    category: "meat",
    description: "Puro sabor. Medallón jugoso, costra crujiente y pan suavecito. Especialidad familiar.",
    descriptionEn: "Pure flavor. Juicy beef patty with a crispy crust in a soft bun. A family specialty.",
    descriptionPt: "Puro sabor. Hambúrguer artesanal suculento com crosta crocante em pão macio. Nossa especialidade.",
    descriptionRu: "Чистый вкус. Сочная рыбная котлета с хрустящей корочкой в мягкой булочке. Наша гордость.",
    descriptionDe: "Purer Geschmack. Saftiges Burger-Patty mit knuspriger Kruste im weichen Brötchen. Familien-Spezialität.",
    images: [
      "/Fotos menu/hamburguesa/1.jpg",
      "/Fotos menu/hamburguesa/2.jpg",
      "/Fotos menu/hamburguesa/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 19000, suffix: " Sale con todo: jamón, queso y huevo + papas y bebida.", suffixEn: " With everything: ham, cheese, and egg + fries and soda.", suffixPt: " Vem com tudo: presunto, queijo e ovo frito, acompanhado de batata frita e refri gelado.", suffixRu: " Всё включено: ветчина, сыр, яйцо + картофель фри и напиток.", suffixDe: " Mit allem: Schinken, Käse und Ei + Pommes und Getränk.", features: ["Papas", "Bebida", "Jamón, Queso y Huevo"], featuresEn: ["Fries", "Soda", "Ham, Cheese & Egg"], featuresPt: ["Batata Frita", "Refri", "Presunto, Queijo e Ovo frito"], featuresRu: ["Картофель фри", "Напиток", "Ветчина, сыр и яйцо"], featuresDe: ["Pommes", "Getränk", "Schinken, Käse & Ei"] },
      { id: "completa", label: "Completa", labelEn: "Full", labelPt: "Completo", labelRu: "Полный", labelDe: "Komplett", price: 13000, suffix: " El trío dinámico: con jamón, queso y huevo.", suffixEn: " The dynamic trio: topped with ham, cheese, and fried egg.", suffixPt: " O trio dinâmico: deliciosamente montado com presunto, queijo e ovo frito na chapa.", suffixRu: " Динамичное трио: с ветчиной, сыром и жареным яйцом.", suffixDe: " Das dynamische Trio: mit Schinken, Käse und Spiegelei.", features: ["Jamón, Queso y Huevo"], featuresEn: ["Ham, Cheese & Egg"], featuresPt: ["Presunto, Queijo e Ovo Frito"], featuresRu: ["Ветчина, сыр и яйцо"], featuresDe: ["Schinken, Käse & Ei"] },
      { id: "sola", label: "Sola", labelEn: "Solo", labelPt: "Só o lanche", labelRu: "Только сэндвич", labelDe: "Nur Burger", price: 9000, suffix: " Simple, rica y espectacular.", suffixEn: " Simple, rich, and spectacular.", suffixPt: " Simples, saboroso e espetacular.", suffixRu: " Просто, сытно и невероятно вкусно.", suffixDe: " Einfach und lecker." }
    ]
  },
  {
    id: "bondiola",
    name: "Bondiola",
    nameEn: "Bondiola",
    namePt: "Bondiola",
    nameRu: "Бондиола",
    nameDe: "Schweinenacken",
    category: "meat",
    description: "Un super clásico. Churrasquito de cerdo al limón, dorado por fuera y tierno por dentro.",
    descriptionEn: "A super classic. Lemon-marinated pork shoulder steak, seared on the outside and tender inside.",
    descriptionPt: "Clássico argentino. Carne de porco macia com toque de limão, dourada e suculenta.",
    descriptionRu: "Аргентинская классика. Свиная шея с лимоном, обжаренная снаружи и нежная внутри.",
    descriptionDe: "Ein argentinischer Klassiker. Zartes Schweinenackensteak mit Limette, außen knusprig gegrillt.",
    images: [
      "/Fotos menu/bondiola/1.jpg",
      "/Fotos menu/bondiola/2.jpg",
      "/Fotos menu/bondiola/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 21000, suffix: " Con todo: jamón, queso y huevo + papas y bebida.", suffixEn: " With everything: ham, cheese, and egg + fries and soda.", suffixPt: " Vem com tudo: completão com presunto, queijo e ovo frito, acompanhado de batatas e refri.", suffixRu: " Полный фарш: ветчина, сыр, яйцо + картофель фри и напиток.", suffixDe: " Mit Schinken, Käse und Spiegelei + Pommes und Getränk.", features: ["Papas", "Bebida", "Jamón, Queso y Huevo"], featuresEn: ["Fries", "Soda", "Ham, Cheese & Egg"], featuresPt: ["Batata Frita", "Refri", "Presunto, Queijo e Ovo Frito"], featuresRu: ["Картофель фри", "Напиток", "Ветчина, сыр и яйцо"], featuresDe: ["Pommes", "Getränk", "Schinken, Käse & Ei"] },
      { id: "completa", label: "Completa", labelEn: "Full", labelPt: "Completo", labelRu: "Полный", labelDe: "Komplett", price: 16000, suffix: " Con los agregados infalibles: jamón, queso y huevo.", suffixEn: " With the infallible extras: ham, cheese, and fried egg.", suffixPt: " Com as adições infalíveis: presunto, queijo e ovo frito no capricho.", suffixRu: " Идеальное дополнение: ветчина, сыр и жареное яйцо.", suffixDe: " Mit den unfehlbaren Extras: Schinken, Käse und Spiegelei.", features: ["Jamón, Queso y Huevo"], featuresEn: ["Ham, Cheese & Egg"], featuresPt: ["Presunto, Queijo e Ovo Frito"], featuresRu: ["Ветчина, сыр и яйцо"], featuresDe: ["Schinken, Käse & Ei"] },
      { id: "sola", label: "Sola", labelEn: "Solo", labelPt: "Só o lanche", labelRu: "Только сэндвич", labelDe: "Nur Sandwich", price: 13000, suffix: " Pan y bondiola. No se diga más.", suffixEn: " Bread and pork. Say no more.", suffixPt: " Apenas pão e bondiola. Impecável e tradicional.", suffixRu: " Хлеб и мясо. Больше ничего не нужно.", suffixDe: " Brot und Fleisch. Mehr braucht man nicht." }
    ]
  },
  {
    id: "ojo-bife",
    name: "Ojo de Bife",
    nameEn: "Steak Sandwich",
    namePt: "Bife Ancho",
    nameRu: "Рибай-сэндвич",
    nameDe: "Ribeye-Steak",
    category: "meat",
    description: "Para darse un gusto. Ojo de bife premium, vuelta y vuelta, súper tierno y sabroso.",
    descriptionEn: "Treat yourself. Premium seared ribeye steak, super tender and flavorful.",
    descriptionPt: "Para se dar um luxo. Corte premium de bife ancho grelhado, super macio e saboroso.",
    descriptionRu: "Побалуйте себя. Премиальный стейк рибай на гриле, невероятно нежный и сочный.",
    descriptionDe: "Gönn dir was. Erstklassig gegrilltes Ribeye-Steak, super zart und geschmackvoll.",
    images: [
      "/Fotos menu/ojo de bife/1.jpg",
      "/Fotos menu/ojo de bife/2.jpg",
      "/Fotos menu/ojo de bife/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 23000, suffix: " Como un rey: con jamón, queso y huevo + papas y bebida.", suffixEn: " Like a king: ham, cheese, and egg + fries and soda.", suffixPt: " Feito para um rei: presunto, queijo e ovo frito, acompanhado de batata frita e refri.", suffixRu: " Как для короля: с ветчиной, сыром, яйцом + картофель фри и напиток.", suffixDe: " Wie ein König: mit Schinken, Käse und Ei + Pommes und Getränk.", features: ["Papas", "Bebida", "Jamón, Queso y Huevo"], featuresEn: ["Fries", "Soda", "Ham, Cheese & Egg"], featuresPt: ["Batatas", "Refri", "Presunto, Queijo e Ovo Frito"], featuresRu: ["Картофель фри", "Напиток", "Ветчина, сыр и яйцо"], featuresDe: ["Pommes", "Getränk", "Schinken, Käse & Ei"] },
      { id: "completo", label: "Completo", labelEn: "Full", labelPt: "Completo", labelRu: "Полный", labelDe: "Komplett", price: 19000, suffix: " La combinación de sabor definitiva: jamón, queso y huevo.", suffixEn: " The ultimate flavor combination: ham, cheese, and fried egg.", suffixPt: " A combinação definitiva de sabor portenho: presunto, queijo e ovo frito.", suffixRu: " Идеальное сочетание вкусов: ветчина, сыр и жареное яйцо.", suffixDe: " Die ultimative Gschmackskombination: Schinken, Käse und Spiegelei.", features: ["Jamón, Queso y Huevo"], featuresEn: ["Ham, Cheese & Egg"], featuresPt: ["Presunto, Queijo e Ovo Frito"], featuresRu: ["Ветчина, сыр и яйцо"], featuresDe: ["Schinken, Käse & Ei"] },
      { id: "solo", label: "Solo", labelEn: "Solo", labelPt: "Só o lanche", labelRu: "Только сэндвич", labelDe: "Nur Sandwich", price: 16000, suffix: " Solo para los puristas: Pan, carne y pan.", suffixEn: " For purists only: Bread, meat, and bread.", suffixPt: " Só para os puristas: pão, bife ancho de primeira e pão.", suffixRu: " Только для пуристов: хлеб, премиальное мясо и хлеб.", suffixDe: " Nur für Puristen: Brot, Fleisch und Brot." }
    ]
  },
  {
    id: "bondiola-popito",
    name: "Bondiola Popito",
    nameEn: "Pulled Pork 'Popito'",
    namePt: "Bondiola Popito Desfiada",
    nameRu: "Рваная Свинина",
    nameDe: "Pulled Pork Popito",
    category: "meat",
    description: "Bondiola de cerdo tiernizada a la cerveza durante 4 horas y desmechada, servida en un rico pan de papa con semillas.",
    descriptionEn: "Beer-braised pulled pork shoulder slow-cooked for 4 hours, served in a delicious seeded potato bun.",
    descriptionPt: "Carne de porco desfiada, cozida na cerveja por 4h, em pão de batata tostado com sementes.",
    descriptionRu: "Рваная свинина, томленая в пиве 4 часа, в картофельной булочке с семенами.",
    descriptionDe: "4 Stunden in Bier zartgeschmortes Pulled Pork, serviert im köstlichen Körner-Kartoffelbrötchen.",
    images: [
      "/Fotos menu/popito/1.jpg",
      "/Fotos menu/popito/2.jpg",
      "/Fotos menu/popito/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 22000, suffix: " Sale con papas y bebida fresquita.", suffixEn: " Served with fries and a cold soda.", suffixPt: " Acompanha batata frita super crocante e um refri trincando.", suffixRu: " С хрустящим картофелем фри и ледяным напитком.", suffixDe: " Mit knusprigen Pommes und einem kühlen Getränk.", features: ["Papas", "Bebida"], featuresEn: ["Fries", "Soda"], featuresPt: ["Batata Frita", "Refrigerante"], featuresRu: ["Картофель фри", "Напиток"], featuresDe: ["Pommes", "Getränk"] },
      { id: "sola", label: "Sola", labelEn: "Solo", labelPt: "Só o lanche", labelRu: "Только сэндвич", labelDe: "Nur Sandwich", price: 16000, suffix: " Solo el sándwich en su máxima expresión.", suffixEn: " Just the sandwich in its ultimate expression.", suffixPt: " Apenas o lanche, degustado em sua máxima glória.", suffixRu: " Только сэндвич во всем его великолепии.", suffixDe: " Nur das Sandwich in seiner vollkommenen Pracht." }
    ]
  },
  {
    id: "hamburguesa-veggie",
    name: "Hamburguesa Vegetal",
    nameEn: "Plant-Based Burger",
    namePt: "Hambúrguer Vegetal",
    nameRu: "Веганский Бургер",
    nameDe: "Veggie Burger",
    category: "veggie",
    description: "Medallón 100% casero, a base de proteina de soja, mix de vegetales y especias + salteado de cebolla y morrón.",
    descriptionEn: "100% homemade patty made of soy protein, mixed veggies, and spices + sautéed onions and bell peppers.",
    descriptionPt: "Hambúrguer 100% caseiro de soja com vegetais, especiarias e refogado de cebola e pimentão.",
    descriptionRu: "Домашняя соевая котлета с овощами, специями, обжаренным луком и сладким перцем.",
    descriptionDe: "Hausgemachtes Soja-Patty mit Gemüse und Gewürzen + gebratenen Zwiebeln und Paprika.",
    images: [
      "/Fotos menu/hamburguesa vegana/1.jpg",
      "/Fotos menu/hamburguesa vegana/2.jpg",
      "/Fotos menu/hamburguesa vegana/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 23000, suffix: " Sale con papas y bebida fresquita.", suffixEn: " Served with fries and a cold soda.", suffixPt: " Acompanha batata frita bem crocante e refri geladinho.", suffixRu: " В компании с картофелем фри и холодным напитком.", suffixDe: " Mit Pommes und einem kühlen Getränk.", features: ["Papas", "Bebida", "Queso, Cebolla, Morrón"], featuresEn: ["Fries", "Soda", "Cheese, Onions & Peppers"], featuresPt: ["Batatas", "Refrigerante", "Queijo, Cebola e Pimentão"], featuresRu: ["Картофель", "Напиток", "Сыр, лук и перец"], featuresDe: ["Pommes", "Getränk", "Käse & Paprika"] },
      { id: "vegetariana", label: "Vegetariana", labelEn: "Vegetarian", labelPt: "Vegetariano", labelRu: "Вегетарианский", labelDe: "Vegetarisch", price: 16000, suffix: " Sale con queso Dambo y huevo.", suffixEn: " Served with traditional Dambo cheese and fried egg.", suffixPt: " Leva queijo prato fatiado, derretido com um ovo frito no capricho.", suffixRu: " С ломтиком плавленого сыра и жареным яйцом.", suffixDe: " Mit geschmolzenem Käse und Spiegelei.", features: ["Queso", "Salteado", "Huevo"], featuresEn: ["Cheese", "Sautéed Veggies", "Egg"], featuresPt: ["Queijo", "Legumes Refogados", "Ovo Frito"], featuresRu: ["Сыр", "Жареные овощи", "Яйцо"], featuresDe: ["Käse", "Gebratenes Gemüse", "Ei"] },
      { id: "vegana", label: "Vegana", labelEn: "Vegan", labelPt: "Vegano", labelRu: "Веганский", labelDe: "Vegan", price: 16000, suffix: " Sale con queso a base de tofu y mucho sabor.", suffixEn: " Served with tofu-based cheese and lots of flavor.", suffixPt: " Leva queijo de tofu derretidinho e muito, muito sabor.", suffixRu: " С расплавленным сыром из тофу и ярким вкусом.", suffixDe: " Mit zartschmelzendem Tofu-Käse und vollem Geschmack.", features: ["Queso de tofu", "Salteado"], featuresEn: ["Tofu Cheese", "Sautéed Veggies"], featuresPt: ["Queijo de Tofu", "Legumes Refogados"], featuresRu: ["Сыр из тофу", "Жареные овощи"], featuresDe: ["Tofu-Käse", "Gebratenes Gemüse"] }
    ]
  },
  {
    id: "milanesa-veggie",
    name: "Milanesa Vegetal",
    nameEn: "Plant-Based Milanesa",
    namePt: "Milanesa Vegetal",
    nameRu: "Веганский Шницель",
    nameDe: "Veggie-Schnitzel",
    category: "veggie",
    description: "Milanesa caserita, con proteina de soja, zapallito y zanahoria rallada. Crocante por fuera, muy sabrosa por dentro.",
    descriptionEn: "Homemade breaded soy cutlet with zucchini and grated carrots. Crispy outside, very tasty inside.",
    descriptionPt: "Milanesa de soja à parmegiana com abobrinha e cenoura. Crocante por fora e muito saborosa.",
    descriptionRu: "Соевый шницель с овощами, хрустящий снаружи и вкусный внутри.",
    descriptionDe: "Hausgemachtes Soja-Schnitzel mit Zucchini und Karotten. Außen knusprig, innen sehr schmackhaft.",
    images: [
      "/Fotos menu/milanesa vegana/1.jpg",
      "/Fotos menu/milanesa vegana/2.jpg",
      "/Fotos menu/milanesa vegana/3.jpg"
    ],
    options: [
      { id: "combo", label: "Combo", labelEn: "Combo", labelPt: "Combo", labelRu: "Комбо", labelDe: "Menü", price: 23000, suffix: " Sale con papas y bebida fresquita.", suffixEn: " Served with fries and a cold soda.", suffixPt: " Acompanha aquela batata frita deliciosa e um refri trincando.", suffixRu: " В компании с картофелем фри и холодным напитком.", suffixDe: " Mit knusprigen Pommes und kühlem Getränk.", features: ["Papas", "Bebida"], featuresEn: ["Fries", "Soda"], featuresPt: ["Batata Frita", "Refrigerante"], featuresRu: ["Картофель фри", "Напиток"], featuresDe: ["Pommes", "Getränk"] },
      { id: "vegetariana", label: "Vegetariana", labelEn: "Vegetarian", labelPt: "Vegetariano", labelRu: "Вегетарианский", labelDe: "Vegetarisch", price: 16000, suffix: " Fresca, sana y re rica.", suffixEn: " Fresh, healthy, and super tasty.", suffixPt: " Fresquinha, saudável e muito crocante.", suffixRu: " Свежий, полезный и очень вкусно хрустит.", suffixDe: " Frisch, gesund und super lecker.", features: ["Queso Dambo", "Lechuga", "Tomate"], featuresEn: ["Cheese", "Lettuce", "Tomato"], featuresPt: ["Queijo Prato", "Alface", "Tomate"], featuresRu: ["Сыр", "Салат", "Помидор"], featuresDe: ["Käse", "Salat", "Tomate"] },
      { id: "vegana", label: "Vegana", labelEn: "Vegan", labelPt: "Vegano", labelRu: "Веганский", labelDe: "Vegan", price: 16000, suffix: "Opcion cien por ciento plant-based.", suffixEn: " 100% plant-based option.", suffixPt: " Opção 100% plant-based, sem perder a deliciosa crocância.", suffixRu: " 100% растительный вариант с хрустящей корочкой.", suffixDe: " 100% pflanzliche Option mit knuspriger Kruste.", features: ["Queso de tofu", "Lechuga", "Tomate"], featuresEn: ["Tofu Cheese", "Lettuce", "Tomato"], featuresPt: ["Queijo de Tofu", "Alface", "Tomate"], featuresRu: ["Сыр из тофу", "Салат", "Помидор"], featuresDe: ["Tofu-Käse", "Salat", "Tomate"] }
    ]
  },
  {
    id: "papas",
    name: "Papas Fritas",
    nameEn: "French Fries",
    namePt: "Batata Frita",
    nameRu: "Картофель фри",
    nameDe: "Pommes Frites",
    category: "extras",
    description: "Crocantes, doraditas y listas para acompañar o para picar. El clásico de siempre que no puede faltar.",
    descriptionEn: "Crispy, golden, and ready to share or eat as a side. The classic that can't be missing.",
    descriptionPt: "Crocantes e douradinhas. O clássico perfeito para acompanhar ou petiscar.",
    descriptionRu: "Хрустящий и золотистый. Идеальная классика к блюду или как закуска.",
    descriptionDe: "Knusprig, lecker und bereit zum Teilen. Der Beilagen-Klassiker.",
    images: [
      "/Fotos menu/papas/1.JPG",
      "/Fotos menu/papas/2.JPG",
      "/Fotos menu/papas/3.JPG"
    ],
    options: [
      { id: "porcion", label: "Porción", labelEn: "Portion", labelPt: "Porção avulsa", labelRu: "Порция", labelDe: "Portion", price: 4500, suffix: " Pedilas solas o en combo con tu sandwich preferido.", suffixEn: " Get them alone or joined with your favorite sandwich.", suffixPt: " Peça a porção avulsa ou adicione ao combo do seu lanche favorito.", suffixRu: " Закажите отдельно или добавьте к любимому сэндвичу.", suffixDe: " Perfekt als Snack oder zu deinem Lieblingssandwich." }
    ]
  },
  {
    id: "bebidas",
    name: "Bebidas",
    nameEn: "Drinks",
    namePt: "Bebidas",
    nameRu: "Напитки",
    nameDe: "Getränke",
    category: "extras",
    description: "Refrescos y aguas heladas para acompañar tu pedido.",
    descriptionEn: "Refreshments and ice-cold water to pair with your order.",
    descriptionPt: "Refrigerantes e águas trincando de geladas para o seu lanche.",
    descriptionRu: "Газировка и ледяная вода, чтобы идеально дополнить ваш заказ.",
    descriptionDe: "Eiskalte Erfrischungen und Wasser passend zu deiner Bestellung.",
    images: [],
    options: [
      { id: "gaseosa", label: "Gaseosa", labelEn: "Soda", labelPt: "Refrigerante", labelRu: "Газировка", labelDe: "Softdrink", price: 2500 },
      { id: "agua-saborizada", label: "Agua saborizada", labelEn: "Flavored Water", labelPt: "Água Saborizada", labelRu: "Вода с вкусом", labelDe: "Wasser mit Geschmack", price: 2500 },
      { id: "agua-mineral", label: "Agua mineral", labelEn: "Mineral Water", labelPt: "Água Mineral", labelRu: "Мин. вода", labelDe: "Mineralwasser", price: 2000 }
    ]
  }
];
