import { useState, type FormEvent } from "react";
import FormField from "../components/FormField";
import PageHeader from "../components/PageHeader";
import { site } from "../config/site";
import { ApiError, postJson } from "../lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("loading");
    setErrors({});
    try {
      const res = await postJson<{ message: string }>("/api/contact", data);
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
      <PageHeader title="Contact" subtitle="Une question, une suggestion ? Écrivez-nous." />

      <section className="section">
        <div className="container contact">
          <aside className="contact__info">
            <h2>Nos coordonnées</h2>
            <ul>
              <li>
                <strong>Adresse</strong>
                <span>{site.contact.adresse}</span>
              </li>
              <li>
                <strong>E-mail</strong>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              <li>
                <strong>Téléphone</strong>
                <span>{site.contact.telephone}</span>
              </li>
            </ul>
          </aside>

          <form className="form card" onSubmit={handleSubmit} noValidate>
            <div className="form__row">
              <FormField label="Nom complet" name="nom" error={errors.nom} required>
                <input id="nom" name="nom" type="text" autoComplete="name" required />
              </FormField>
              <FormField label="E-mail" name="email" error={errors.email} required>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </FormField>
            </div>
            <FormField label="Sujet" name="sujet" error={errors.sujet} required>
              <input id="sujet" name="sujet" type="text" required />
            </FormField>
            <FormField label="Message" name="message" error={errors.message} required>
              <textarea id="message" name="message" rows={6} required />
            </FormField>

            {status === "success" && <p className="alert alert--success">{message}</p>}
            {status === "error" && <p className="alert alert--error">{message}</p>}

            <button type="submit" className="btn btn--primary" disabled={status === "loading"}>
              {status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
