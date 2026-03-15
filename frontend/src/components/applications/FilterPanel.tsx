/**
 * Плавающая панель фильтрации списка приложений.
 * Открывается по кнопке слева, позволяет задавать текст
 * и селекты. Все изменения отражаются в query-параметрах
 * маршрута через navigate(..., replace:true).
 */
import { useState, useEffect } from 'react';
import { Route, type ApplicationsSearch } from '../../routes/applications';
import { useNavigate } from '@tanstack/react-router';
import { Search, RotateCcw, Filter, X } from 'lucide-react';

// Импорты shadcn/ui
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FilterPanel() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(search.query || '');

  // Debounce для текстового поиска.
  // Чтобы не отправлять navigate на каждое нажатие клавиши, 
  // откладываем обновление query-параметра на 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== (search.query || '')) {
        navigate({
          search: (prev: ApplicationsSearch) => ({ ...prev, query: localQuery || undefined }),
          replace: true,
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localQuery, navigate, search.query]);

  // Синхронизация при внешнем сбросе
  useEffect(() => {
    // В данном случае это контролируемый сценарий синхронизации локального ввода
    // с внешним состоянием роутера, поэтому допускаем вызов setState в эффекте.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalQuery(search.query || '');
  }, [search.query]);

  // Обновляет один из селектов (status/budget).
  // Если значение "all" — снимаем фильтр чтобы не засорять URL.
  const updateSelectFilter = (key: keyof ApplicationsSearch, value: string | undefined) => {
    navigate({
      search: (prev: ApplicationsSearch) => ({
        ...prev,
        [key]: value === "all" ? undefined : (value || undefined),
      }),
      replace: true,
    });
  };

  // Сбрасывает все фильтры одновременно (очищает состояние и URL).
  const clearFilters = () => {
    setLocalQuery('');
    navigate({ search: {}, replace: true });
  };

  const hasFilters = !!(search.query || search.status || search.budget);

  return (
    <div className="relative flex items-start antialiased">
      {/* КНОПКА-ТРИГГЕР */}
      <Button
        variant={isOpen ? "secondary" : "outline"}
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 w-10 rounded-full shadow-md z-50 bg-card transition-all duration-200",
          isOpen && "rounded-r-none border-r-0 shadow-none bg-accent translate-x-px",
          hasFilters && !isOpen && "ring-2 ring-primary ring-offset-2"
        )}
      >
        {isOpen ? (
          <X className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Filter className={cn("h-4 w-4", hasFilters && "text-primary")} />
        )}
      </Button>

      {/* ОСНОВНАЯ ПАНЕЛЬ */}
      {isOpen && (
        <div 
          className={cn(
            "flex flex-col gap-4 w-72 bg-card/95 backdrop-blur-md border border-border p-5 shadow-2xl z-40",
            "rounded-xl rounded-tl-none animate-in fade-in slide-in-from-left-2 duration-200"
          )}
        >
          {/* Заголовок и Сброс */}
          <div className="flex items-center justify-between h-7">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
              Фильтрация
            </span>
            
            {hasFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="h-7 px-2 text-[10px] font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <RotateCcw className="mr-1 h-3 w-3" /> 
                Сбросить
              </Button>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Контент формы */}
          <div className="grid gap-5">
            {/* Поиск */}
            <div className="space-y-2">
              <Label htmlFor="search-input" className="text-[11px] font-semibold text-foreground/70 ml-0.5">
                Название приложения
              </Label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="search-input"
                  autoFocus
                  placeholder="Введите запрос..."
                  className="pl-9 h-9 text-sm bg-background/50 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Выпадающие списки в ряд */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-foreground/70 ml-0.5">Статус</Label>
                <Select 
                  value={search.status || "all"} 
                  onValueChange={(v) => updateSelectFilter('status', v)}
                >
                  <SelectTrigger className="h-9 text-xs bg-background/50 border-border/60 focus:ring-1 focus:ring-primary/40 focus:ring-offset-0 transition-all">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="КИС">КИС</SelectItem>
                    <SelectItem value="ЛИС">ЛИС</SelectItem>
                    <SelectItem value="Спец.ПО">Спец.ПО</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-foreground/70 ml-0.5">Бюджет</Label>
                <Select 
                  value={search.budget || "all"} 
                  onValueChange={(v) => updateSelectFilter('budget', v)}
                >
                  <SelectTrigger className="h-9 text-xs bg-background/50 border-border/60 focus:ring-1 focus:ring-primary/40 focus:ring-offset-0 transition-all">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="А">А</SelectItem>
                    <SelectItem value="D">В разработке</SelectItem>
                    <SelectItem value="С">С</SelectItem>
                    <SelectItem value="N">Новые</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-border/30 mt-1" />
          
          <div className="flex justify-center italic text-[9px] text-muted-foreground/40">
            Результаты обновляются автоматически
          </div>
        </div>
      )}
    </div>
  );
}