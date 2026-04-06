import { collection, addDoc, getDocs, serverTimestamp, DocumentReference } from 'firebase/firestore';
import { db } from '../config/firebase';
import { B2bLead, B2bLeadResponse } from '../utils/types';

// Collection name for leads in Firestore
const LEADS_COLLECTION = 'leads';

/**
 * Save lead data to Firestore
 * @param leadData - The B2B lead data to save
 * @returns Promise<B2bLeadResponse> - The saved lead data with Firestore document ID
 */
export const saveLeadToFirestore = async (leadData: B2bLead): Promise<B2bLeadResponse> => {
  try {
    // Add timestamp to the lead data
    const leadWithTimestamp = {
      ...leadData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add document to Firestore collection
    const docRef: DocumentReference = await addDoc(
      collection(db, LEADS_COLLECTION),
      leadWithTimestamp
    );

    // Return the lead data with the Firestore document ID
    const response: B2bLeadResponse = {
      uid: docRef.id,
      Fname: leadData.Fname,
      Lname: leadData.Lname,
      Tel: leadData.Tel,
      Email: leadData.Email,
      Company: leadData.Company,
      CompanyID: leadData.CompanyID,
      InterestedProject: leadData.InterestedProject,
      Source: leadData.Source,
      PDPA: leadData.PDPA,
      TypeInterest: leadData.TypeInterest
    };

    return response;
  } catch (error) {
    console.error('Error saving lead to Firestore:', error);
    throw new Error(`Failed to save lead data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all leads from Firestore for admin dashboard
 * @returns Promise<B2bLeadResponse[]> - Array of lead data with document IDs
 */
export const getLeadsFromFirestore = async (): Promise<B2bLeadResponse[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, LEADS_COLLECTION));
    const leads: B2bLeadResponse[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leads.push({
        uid: doc.id,
        Fname: data.Fname,
        Lname: data.Lname,
        Tel: data.Tel,
        Email: data.Email,
        Company: data.Company,
        CompanyID: data.CompanyID,
        InterestedProject: data.InterestedProject,
        Source: data.Source,
        PDPA: data.PDPA,
        TypeInterest: data.TypeInterest
      });
    });

    return leads;
  } catch (error) {
    console.error('Error fetching leads from Firestore:', error);
    throw new Error(`Failed to fetch leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
