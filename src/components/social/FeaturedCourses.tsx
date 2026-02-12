import { GraduationCap, Clock, Users, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: "Básico" | "Intermedio" | "Avanzado";
  isFree: boolean;
}

const FEATURED_COURSES: Course[] = [
  { id: "c1", title: "Creación de DreamSpaces XR", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", instructor: "XR_Pioneer", duration: "4h 30m", students: 1250, rating: 4.8, level: "Intermedio", isFree: false },
  { id: "c2", title: "Monetización en TAMV", thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400", instructor: "EconTAMV", duration: "2h 15m", students: 3400, rating: 4.9, level: "Básico", isFree: true },
  { id: "c3", title: "Arte Digital y NFTs", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400", instructor: "ArteLATAM", duration: "6h 00m", students: 890, rating: 4.7, level: "Avanzado", isFree: false },
];

export default function FeaturedCourses() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Universidad TAMV
        </h2>
        <button onClick={() => navigate("/tutoriales")} className="text-sm text-primary hover:underline flex items-center gap-1">
          Ver cursos <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="space-y-3">
        {FEATURED_COURSES.map((course) => (
          <div key={course.id} className="card-tamv flex gap-3 p-3 cursor-pointer hover:border-primary/30 transition-all group">
            <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              {course.isFree && (
                <Badge className="absolute top-1 left-1 text-[10px] bg-accent text-accent-foreground">GRATIS</Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">por {course.instructor}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" />{course.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
