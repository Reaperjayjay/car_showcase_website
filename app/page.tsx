import Image from "next/image";
import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";
import { HomeProps } from "@/types";

export default async function Home({ searchParams }: HomeProps) {
  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || "",
    baseYear: searchParams.year || 2022,
    fuel: searchParams.fuel || "",
    model: searchParams.model || "",
  });
  console.log("API RESPONSE:", allCars);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  const currentLimit = searchParams.limit ? Number(searchParams.limit) : 10;
  const carsToShow = allCars.slice(0, currentLimit);
  console.log(
    `Array Length: ${allCars.length} | Current Limit: ${currentLimit} | isNext: ${currentLimit >= allCars.length}`,
  );

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>
        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {carsToShow.map((car, index) => (
                <CarCard key={`car-${index}`} car={car} />
              ))}
            </div>
            <ShowMore
              pageNumber={currentLimit / 10}
              isNext={currentLimit >= allCars.length}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font bold">
              Sorry,no cars found
            </h2>
            <p>{"No cars available"}</p>
          </div>
        )}
      </div>
    </main>
  );
}
