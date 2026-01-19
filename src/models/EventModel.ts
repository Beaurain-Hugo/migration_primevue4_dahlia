export default interface Event {
  id: number;
  titre: string; 
  description: string;
  date_debut: Date; 
  date_fin: Date;
  heure_debut:string,
  heure_fin:number,
  lieu:string,
  association_id: number;
}
