import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) { return <Link className="category-card" to={`/categories?focus=${category.slug}`}><div className="category-icon" style={{ '--category-color': category.color }}>{category.icon}</div><div className="category-card-top"><span className="category-label">{category.label}</span><ArrowUpRight size={16} /></div><h3>{category.title}</h3><p>{category.description}</p><div className="category-meta"><span>{category.challengeCount} challenges</span><span className="category-progress"><i style={{ width: `${category.progress}%` }} /></span><span>{category.progress}%</span></div></Link> }
