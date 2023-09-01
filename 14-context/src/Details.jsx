import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import AdoptedPetContext from "./AdoptedPetContext";
import Modal from "./Modal";
import ErrorBoundary from "./ErrorBoundary";
import fetchPet from "./fetchPet";

const Details = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const results = useQuery(["details", id], fetchPet);
  // eslint-disable-next-line no-unused-vars
  const [_, setAdoptedPet] = useContext(AdoptedPetContext);

  if (results.isLoading) {
    return (
      <div className="loading-pane">
        <h2 className="loader">🌀</h2>
      </div>
    );
  }

  const pet = results.data.pets[0];

  return (
    <div>
      <Carousel images={pet.images} pet={pet} setShowModal={setShowModal} />
      <div>
        {showModal ? (
          <Modal>
            <div className="flex flex-col gap-4 place-items-center m-10">
              <h1>Would you like to adopt {pet.name}?</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setAdoptedPet(pet);
                    navigate("/");
                  }}
                  className="border border-black p-5"
                >
                  Yes
                </button>
                <button
                  className="border border-black p-5"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

const Carousel = ({ images, pet, setShowModal }) => {
  const [active, setActive] = useState(0);
  const handleIndexClick = (event) => {
    setActive(event.target.dataset.index);
  };

  return (
    <div className="flex place-items-center gap-10">
      <img
        className="md:ml-60"
        width={"400px"}
        src={images[active]}
        alt="animal"
      />
      <div className="grid grid-cols-12 gap-10 w-full">
        <div className="col-span-6">
          <h1>{pet.name}</h1>
          <h2>{`${pet.animal} — ${pet.breed} — ${pet.city}, ${pet.state}`}</h2>
          <button
            className="border border-orange-600 p-5"
            onClick={() => setShowModal(true)}
          >
            Adopt {pet.name}
          </button>
          <p>{pet.description}</p>
        </div>
        <div className="col-span-6" />

        <div className="flex col-span-12 justify-between gap-1">
          <div className="flex flex-wrap gap-1">
            {images.map((photo, index) => (
              // eslint-disable-next-line
              <img
                width={"100px"}
                key={photo}
                src={photo}
                alt="animal thumbnail"
                onClick={handleIndexClick}
                data-index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
