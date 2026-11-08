import Link from 'next/link';
import NavigationContent from './NavigationContent';
import BokmarkenTrigger from './ordbok/BokmarkenTrigger';

/** Same navigation content on the main site and static dictionary articles. */
export default function Toppnav({ active }: { active?: string }) {
  return <NavigationContent active={active} LinkComponent={Link}
    bookmarkControl={<BokmarkenTrigger visaNoll={false} label="Ordlista" />} />;
}
