import Image from "next/image";
import Link from "next/link";
import { Category, Product } from "@/database/models/index";

export default async function Home() {
    const categories = await Category.findAll({ limit: 4 });
    const products = await Product.findAll({ limit: 8, include: ["sizes"] });

    return (
        <>
            <section className="w-full">
                <Image
                    src="/hero-section.jpg"
                    alt="Home"
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                    priority="high"
                />
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10 space-y-10">
                    <h1 className="text-5xl font-semibold uppercase text-center">Colecciones</h1>
                    <div className="flex flex-wrap justify-between">
                        {categories.slice(0, 4).map((category) => (
                            <Link
                                key={category.category_id}
                                href={`/collections/${category.category_slug}`}
                                className="w-1/5 space-y-3"
                            >
                                <div className="w-full aspect-square group overflow-hidden rounded-xs">
                                    <img
                                        src={category.category_image}
                                        alt={category.category_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-medium w-full text-center">
                                    {category.category_name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-15 space-y-4 text-center">
                    <h1 className="text-5xl font-semibold uppercase">ISA MAKING ROPA URBANA</h1>
                    <p className="text-xl max-w-3xl text-pretty text-base-content/80 mx-auto">
                        La vida es muy corta para seguir usando prendas aburridas. Viste tu actitud
                        con LSA Making ropa urbana: Camisetas, jeans, gorras, accesorios y mucho
                        más.
                    </p>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10 space-y-10 text-center">
                    <h1 className="text-5xl font-semibold uppercase">EXPLORA NUESTRAS PRENDAS</h1>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-15">
                        {products.map((product) => (
                            <div
                                key={product.product_id}
                                className="rounded-xl overflow-hidden bg-base-200"
                            >
                                <Link href={`/products/${product.product_id}`} className="block w-full group aspect-[9/10] overflow-hidden">
                                    <img
                                        src={product.product_image}
                                        alt={product.product_name}
                                        className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                                    />
                                </Link>
                                <div className="p-4">
                                    <h3 className="text-2xl  w-full text-center leading-tight">
                                        {product.product_name}
                                    </h3>
                                    <p className="text-3xl font-bold w-full text-center leading-tight">
                                        ${Math.min(
                                            ...product.sizes.flatMap(
                                                (size) => size.ProductSize.product_price
                                            )
                                        ).toLocaleString("es-CO")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
