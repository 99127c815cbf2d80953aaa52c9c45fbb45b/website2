import "./AboutSection.css";

/* ------------------------------------------------------------------
   ABOUT — left half (top on mobile). Cream background.
   EDIT COPY: heading + paragraphs below.
------------------------------------------------------------------ */

export default function AboutSection() {
  return (
    <section className="about">
      <div className="about__inner">
        <h2 className="about__heading">About Us</h2>
        <p className="about__body">
          APHRO. is a platform for creators who demand complete control. 
Built on Web3 technology, we offer direct payments, encrypted privacy, 
and uncompromising security so you earn instantly and safely. 
No middlemen. No algorithms. No limits. Just you, your audience, and the freedom to build on your own terms.
        </p>
        <p className="about__body about__body--muted">
         
        </p>
      </div>
    </section>
  );
}
