const articles = [
  {
    id: 1,
    image: "/Articles/vegetables.mp4",
  },
  {
    id: 2,
    image: "/Articles/superfoods.mp4",
  },
  {
    id: 3,
    image: "/Articles/recipes.mp4",
  },
];

const Articles = () => {
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Chef's Gallery </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="relative w-full" style={{ paddingTop: "120%" }}>
                <video
                  src={article.image}
                  alt={article.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  autoPlay
                >
                  <source src={article.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
