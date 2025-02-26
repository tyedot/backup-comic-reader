import ComicReader from '../../components/ComicReader';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
    return <Ionicons name="book" size={size} color={color} />;
  },
};

export default ComicReader;
