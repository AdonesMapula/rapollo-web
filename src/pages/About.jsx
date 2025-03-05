import React from "react";

const About = () => {
  return (
    <div className="bg-black text-white min-h-screen w-full bg-cover bg-center bg-fixed font-hanuman" style={{ backgroundImage: "url('/src/assets/aboutbg.jpg')" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Hanuman:wght@300;400;700&display=swap" rel="stylesheet" />
      
      <div className="text-center pt-15">
        <h1 className="text-4xl font-bold uppercase">RAPOLLO - UBEC CITY</h1>
      </div>
      
      <div className="flex justify-center mt-10">
        <img src="/src/assets/aboutus.jpg" alt="About Us" className="w-4/5 max-w-4xl rounded-2xl shadow-lg" />
      </div>
      
      <div className="px-10 md:px-20 lg:px-40 py-12">
        <section className="mb-12">
          <h2 className="text-3xl text-left font-bold uppercase">Who We Are</h2>
          <p className="text-lg text-white-400 mt-4 leading-relaxed">
            Rapollo is Cebu’s pioneering hip-hop battle league, bringing raw and authentic rap culture
            to the forefront since 2010. What started as underground rap battles among friends has
            evolved into a movement that champions Cebuano talent and culture.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl text-left font-bold uppercase">Our Mission</h2>
          <p className="text-lg text-white-400 mt-4 leading-relaxed">
            Rapollo is dedicated to providing a platform for local hip-hop artists to showcase their
            skills, embrace their mother tongue, and elevate the VisMin rap scene. We believe in breaking
            barriers, creating opportunities, and fostering a community where creativity thrives.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl text-left font-bold uppercase">Our Journey</h2>
          <p className="text-lg text-white-400 mt-4 leading-relaxed">
            Rapollo has come a long way since its inception, growing from an underground scene into
            a movement that amplifies the voices of talented Cebuano artists. Through years of dedication,
            we’ve created a stronghold for hip-hop in the region.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl text-left font-bold uppercase">Our Impact</h2>
          <p className="text-lg text-white-400 mt-4 leading-relaxed">
            Rapollo is more than just rap battles. We celebrate all elements of hip-hop—MCing, DJing,
            breaking, and graffiti—by curating events that highlight these art forms. Our community has
            grown beyond Cebu, attracting talents from across Visayas and Mindanao, and proving that
            hip-hop in the South is alive and thriving.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
