
import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchBox({ onSearch }) {
  const [filters, setFilters] = useState({
    location: "",
    type: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="absolute left-1/2 top-[70vh] z-20 w-11/12 -translate-x-1/2 rounded-[var(--radius)] bg-background/95 p-8 shadow-2xl backdrop-blur-sm dark:bg-background/80 dark:shadow-primary/5 md:w-3/4 lg:w-2/3">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ubicación"
            className="search-input w-full pl-12"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
        <select 
          className="search-input w-full"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Tipo de Propiedad</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
        </select>
        <Button type="submit" className="h-full w-full rounded-[var(--radius)]">
          <Search className="mr-2 h-5 w-5" />
          Buscar
        </Button>
      </form>
    </div>
  );
}

export default SearchBox;
