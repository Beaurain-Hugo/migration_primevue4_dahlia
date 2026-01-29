export default interface Association {
  id: number;
  name: string; // Nom de l'association
  numero_rna: string; // Numéro RNA de l'association
  numero_siren: string; // Numéro SIREN de l'association
  page_web_url: string; // URL de la page web de l'association
  object: string; // Description de l'association
  email: string; // Email de l'association
  phoneNumber: string; // Numéro de téléphone de l'association
  headOffice:string;
  date_pub_jo: Date;
  user_id: number;
}
