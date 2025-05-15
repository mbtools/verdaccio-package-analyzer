# Convert-DistTagsToSummary.ps1
# Creates a summary table of package versions across different dist-tags

$results = Get-Content -Path "data/dist-tags.json" -Raw | ConvertFrom-Json

# Generate Markdown
$md = @("# Verdaccio NPM Package Version Summary`n")
$md += "| Package | Latest | 6-next | next | next-7 | next-8 | Other Tags |"
$md += "|---------|---------|---------|------|---------|---------|------------|"

foreach ($entry in $results) {
    $package = $entry.Package
    $tags = $entry.Tags
    
    # Initialize version variables
    $latest = "-"
    $sixNext = "-"
    $next = "-"
    $nextSeven = "-"
    $nextEight = "-"
    $otherTags = @()

    # Process each tag
    foreach ($tag in $tags) {
        switch ($tag.Tag) {
            "latest" { $latest = $tag.Version }
            "6-next" { $sixNext = $tag.Version }
            "next" { $next = $tag.Version }
            "next-7" { $nextSeven = $tag.Version }
            "next-8" { $nextEight = $tag.Version }
            default { $otherTags += $tag.Tag }
        }
    }

    # Format other tags
    $otherTagsStr = if ($otherTags.Count -gt 0) {
        ($otherTags | Sort-Object) -join ", "
    } else {
        "-"
    }

    # Add row to markdown
    $md += "| $package | $latest | $sixNext | $next | $nextSeven | $nextEight | $otherTagsStr |"
    $mb += ""
}

$mdText = $md -join "`n"
Set-Content -Path "output/summary.md" -Value $mdText -Encoding UTF8
Write-Host "Summary table generated in summary.md" 