import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useUser } from "../lib/user";
import { useToast } from "../lib/toast";

type Car = {
  _id: Id<"cars">;
  name: string;
  color: string;
  driver: string;
  pax: string[];
};

export function CarsView() {
  const { user } = useUser();
  const toast = useToast();
  const cars = (useQuery(api.cars.list) ?? []) as Car[];
  const board = useMutation(api.cars.boardCar);
  const leave = useMutation(api.cars.leaveCar);

  return (
    <section className="view">
      <div className="view-title">Qui part avec qui</div>
      <div className="view-desc">Clique pour monter / descendre d'une voiture</div>
      <div>
        {cars.map((car) => {
          const isIn = car.pax.includes(user) || car.driver === user;
          const isDriver = car.driver === user;
          const totalPax = car.pax.length + 1;
          return (
            <div className="car" data-color={car.color} key={car._id}>
              <div className="car-head">
                <div className="car-name">{car.name}</div>
                <div className="car-cap">{totalPax} pax</div>
              </div>
              <div className="car-driver">conduit par {car.driver}</div>
              <div className="pax">
                <span className="chip driver">🚗 {car.driver}</span>
                {car.pax.map((p) => (
                  <span className="chip" key={p}>
                    {p}
                  </span>
                ))}
                <span
                  className={`chip add ${isIn && !isDriver ? "in" : ""}`}
                  onClick={async () => {
                    if (isDriver) {
                      toast("Tu conduis cette voiture");
                      return;
                    }
                    if (isIn) {
                      await leave({ carId: car._id, user });
                      toast(`Sorti·e de ${car.name}`);
                    } else {
                      await board({ carId: car._id, user });
                      toast(`Tu montes dans ${car.name}`);
                    }
                  }}
                >
                  {isIn && !isDriver ? "✓ je descends" : "+ je monte"}
                </span>
              </div>
            </div>
          );
        })}
        {cars.length === 0 && (
          <div className="empty">
            <div className="empty-title">Pas de voitures</div>
            <div className="empty-text">Les seeds vont arriver au prochain lancement du backend.</div>
          </div>
        )}
      </div>
    </section>
  );
}
