import { ContactService } from "~/application/contact/contact.service";
import { ConsoleContactRepository } from "~/infrastructure/persistence/contact/console-contact.repository";

const contactRepository = new ConsoleContactRepository();
export const contactService = new ContactService(contactRepository);
