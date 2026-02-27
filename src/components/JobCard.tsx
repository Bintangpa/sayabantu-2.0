import { Clock, Eye, MapPin, Users, Flame, BadgeDollarSign, Sparkles } from "lucide-react";
import type { Job } from "@/data/jobs";

interface JobCardProps {
  job: Job;
  onViewDetail: (job: Job) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const JobCard = ({ job, onViewDetail }: JobCardProps) => {
  return (
    <div className="glass-card group rounded-2xl p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Badges */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {job.isUrgent && (
          <span className="inline-flex items-center gap-1 rounded-md bg-urgent/15 px-2 py-0.5 text-xs font-bold text-urgent">
            <Flame className="h-3 w-3" /> Butuh Cepat
          </span>
        )}
        {job.isHighPay && (
          <span className="inline-flex items-center gap-1 rounded-md bg-high-pay/15 px-2 py-0.5 text-xs font-bold text-high-pay">
            <BadgeDollarSign className="h-3 w-3" /> Bayaran Tinggi
          </span>
        )}
        {job.isNew && (
          <span className="inline-flex items-center gap-1 rounded-md bg-new-badge/15 px-2 py-0.5 text-xs font-bold text-new-badge">
            <Sparkles className="h-3 w-3" /> Baru
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-bold text-foreground leading-snug">{job.title}</h3>

      {/* Meta */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-medium text-primary/80">
          {job.category}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {job.postedAt}
        </span>
      </div>

      {/* Budget */}
      <p className="mb-3 text-lg font-extrabold text-accent">
        {formatCurrency(job.budgetMin)} – {formatCurrency(job.budgetMax)}
      </p>

      {/* Social proof */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3 w-3" /> {job.viewerCount} mitra melihat
        </span>
        {job.applicantCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> {job.applicantCount} mengajukan
          </span>
        )}
        {job.urgentDeadline && (
          <span className="inline-flex items-center gap-1 font-semibold text-urgent">
            <Clock className="h-3 w-3" /> {job.urgentDeadline}
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onViewDetail(job)}
        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary/90 active:scale-[0.98]"
      >
        Lihat Detail
      </button>
    </div>
  );
};

export default JobCard;