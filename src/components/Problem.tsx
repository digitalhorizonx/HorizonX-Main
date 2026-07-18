/**
 * The core business problem — why the network exists.
 * Kept intentionally short: this is a beat in the journey, not a brochure.
 */
export function Problem() {
  return (
    <section id="problem" className="problem" aria-labelledby="problem-title">
      <div className="hx-container problem__inner">
        <p className="hx-kicker hx-reveal">The Problem</p>
        <h2 id="problem-title" className="problem__title hx-reveal" data-delay="0.08">
          Growing businesses run on
          <br />
          <span className="problem__title-dim">disconnected pieces.</span>
        </h2>
        <ul className="problem__list hx-reveal" data-delay="0.16">
          <li>Marketing tools that don't talk to the website</li>
          <li>Websites separate from operations</li>
          <li>Apps isolated from customer data</li>
          <li>Workflows moved by hand, twice</li>
          <li>No unified strategy, no central intelligence</li>
          <li>No measurable path from activity to outcomes</li>
        </ul>
        <p className="problem__resolution hx-reveal" data-delay="0.24">
          HorizonX connects <strong>data → decisions → products → execution → outcomes</strong>{" "}
          in one digitalization intelligence network.
        </p>
      </div>
    </section>
  );
}
