import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Rechercher..." }: SearchBarProps) => (
  <div className="relative max-w-sm">
    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-10 pr-9"
    />
    {value && (
      <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
        <X size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
