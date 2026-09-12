import { useState, type FormEvent } from "react";
import FormField from "../components/FormField";
import PageHeader from "../components/PageHeader";
import { site } from "../config/site";
import { ApiError, postJson } from "../lib/api";

type Status = "idle" | "loading" | "success" | "error";

const raisons = [
  "Participer activement à la vie du mouvement",
  "Être informé en priorité de nos actions et événements",
  "Contribuer à l'élaboration de nos propositions",
  "Rejoindre une communauté de citoyens engagés",
];

export default function Adherer() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const { consentement, ...champs } = Object.fromEntries(new FormData(form));
    // Les champs optionnels vides ne sont pas envoyés.
    const data = Object.fromEntries(Object.entries(champs).filter(([, v]) => v !== ""));

    setStatus("loading");
    setErrors({});
    try {
      const res = await postJson<{ message: string }>("/api/adhesions", {
        ...data,
        consentement: consentement === "on",
      });
      setStatus("success");
      setMessage(res.message);
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof ApiError ? err.message : "Une erreur est survenue.");
      if (err instanceof ApiError) setErrors(err.details);
    }
  }

  return (
    <>
      <PageHeader
        title="Adhérer au mouvement"
        subtitle={`Rejoignez le ${site.sigle} et participez à la construction de notre projet.`}
      />

      <section className="section">
        <div className="container contact">
          <aside className="contact__info">
            <h2>Pourquoi adhérer ?</h2>
            <ul className="checklist">
              {raisons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </aside>

          <form className="form card" onSubmit={handleSubmit} noValidate>
            <div className="form__row">
              <FormField label="Prénom" name="prenom" error={errors.prenom} required>
                <input id="prenom" name="prenom" type="text" autoComplete="given-name" required />
              </FormField>
              <FormField label="Nom" name="nom" error={errors.nom} required>
                <input id="nom" name="nom" type="text" autoComplete="family-name" required />
              </FormField>
            </div>
            <div className="form__row">
              <FormField label="E-mail" name="email" error={errors.email} required>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </FormField>
              <FormField label="Téléphone" name="telephone" error={errors.telephone} required>
                <input id="telephone" name="telephone" type="tel" autoComplete="tel" required />
              </FormField>
            </div>
            <div className="form__row">
              <FormField label="Ville" name="ville" error={errors.ville} required>
                <input id="ville" name="ville" type="text" autoComplete="address-level2" required />
              </FormField>
              <FormField label="Profession" name="profession" error={errors.profession}>
                <input id="profession" name="profession" type="text" autoComplete="organization-title" />
              </FormField>
            </div>
            <FormField label="Vos motivations" name="motivation" error={errors.motivation}>
              <textarea id="motivation" name="motivation" rows={4} />
            </FormField>

            <div className={`field field--checkbox${errors.consentement ? " has-error" : ""}`}>
              <label>
                <input type="checkbox" name="consentement" required />
                J'adhère aux valeurs du {site.sigle} et j'accepte que mes données soient utilisées
                dans le cadre de mon adhésion.
              </label>
              {errors.consentement && (
                <p className="field__error" role="alert">
                  {errors.consentement}
                </p>
              )}
            </div>

            {status === "success" && <p className="alert alert--success">{message}</p>}
            {status === "error" && <p className="alert alert--error">{message}</p>}

            <button type="submit" className="btn btn--accent" disabled={status === "loading"}>
              {status === "loading" ? "Envoi en cours…" : "Valider mon adhésion"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
