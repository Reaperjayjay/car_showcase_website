import { CarProps, FilterProps } from "@/types";
export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

// RapidAPI locked the mpg fields for some reason so I had to find a way around it. This function estimates the missing mpg values based on other car attributes. It's a heuristic approach and may not be accurate for all vehicles.
export const estimateMissingMpg = (car: any) => {
  let estimatedMpg = 28; // Start with a generous base MPG

  // 1. Adjust for Engine Cylinders
  if (car.cylinders >= 8) {
    estimatedMpg -= 10;
  } else if (car.cylinders === 6) {
    estimatedMpg -= 5;
  }

  // 2. Adjust for Engine Displacement (Liters)
  if (car.displacement > 3.0) {
    estimatedMpg -= 4;
  } else if (car.displacement > 2.0) {
    estimatedMpg -= 2;
  }

  // 3. Adjust for Vehicle Age
  const currentYear = new Date().getFullYear();
  const age = currentYear - (car.year || currentYear);
  if (age > 15) {
    estimatedMpg -= 3; // Older tech is less efficient
  }

  // Ensure it never returns a completely unrealistic number (floor of 10 MPG)
  return Math.max(estimatedMpg, 10);
};
export async function fetchCars(filters: FilterProps) {
  const { manufacturer, baseYear, model, fuel } = filters;
  const headers = {
    "x-rapidapi-key": process.env.RAPID_API_KEY || "",
    "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
    "Content-Type": "application/json",
  };
  const currentYear = baseYear ? Number(baseYear) : 2022;
  const yearsToFetch = [currentYear - 1, currentYear, currentYear + 1];
  try {
    const carPromises = yearsToFetch.map(async (year) => {
      const response = await fetch(
        `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&fuel_type=${fuel}`,
        { headers },
      );
      const result = await response.json();
      console.log("RAPIDAPI RAW RESPONSE:", result);
      if (!Array.isArray(result)) {
        return [];
      }
      const sanitizedResult = result.map((car: any) => {
        const city =
          typeof car.city_mpg === "string"
            ? estimateMissingMpg(car)
            : car.city_mpg;
        const highway =
          typeof car.highway_mpg === "string" ? city + 5 : car.highway_mpg;
        const combo =
          typeof car.combination_mpg === "string"
            ? Math.round((city + highway) / 2)
            : car.combination_mpg;

        return {
          ...car,
          city_mpg: city,
          highway_mpg: highway,
          combination_mpg: combo,
        };
      });

      return sanitizedResult;
    });
    const carResults = await Promise.all(carPromises);
    //Since Rapid API doesnt let for a sizeable payload return we clone the 3 responses
    const rawCars = carResults.flat();
    return [
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
      ...rawCars,
    ];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export type CarView = "front" | "side" | "rear" | "interior";
export const generateCarImageUrl = (car: CarProps, view?: CarView) => {
  const url = new URL("https://carimagesapi.com/image");
  const { make, year, model } = car;
  const searchParams = new URLSearchParams();
  searchParams.append("make", make);
  searchParams.append("model", model.split(" ")[0]);
  if (year) {
    searchParams.append("year", `${year}`);
  }
  if (view) {
    searchParams.append("view", view);
  }
  return `/api/car-image?${searchParams.toString()}`;
};
export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};
