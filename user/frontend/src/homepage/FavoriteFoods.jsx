const favoriteFoods = [
  {
    id: 1,
    name: "Pizza",
    description: "Delicious cheesy pizza with a variety of toppings.",
    videoUrl: "/Faviorate/Pizza.mp4",
  },
  {
    id: 2,
    name: "Burger",
    description: "Juicy burger with fresh lettuce, tomatoes, and cheese.",
    videoUrl: "/Faviorate/Burger.mp4",
  },
  {
    id: 3,
    name: "Sushi",
    description: "Fresh sushi rolls with a variety of fillings.",
    videoUrl: "/Faviorate/Sushi.mp4",
  },
];

const FavoriteFoods = () => {
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="p-4 md:p-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-6 text-center">Favorite Foods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              <video
                src={food.videoUrl}
                alt={food.name}
                className="w-full h-96 object-cover"
                autoPlay
                muted
                loop
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2 hover:text-green">
                  {food.name}
                </h3>
                <p className="text-gray-600">{food.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteFoods;
